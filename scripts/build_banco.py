#!/usr/bin/env python3
"""Extrae de las fichas (content/semana-NN/<lectura>/ficha.md) el banco estructurado:
preguntas modelo, trampas probables y pares que se confunden.

Salida: content/banco/<semana>/<lectura>.json y content/banco/index.json.
La ficha es la fuente; los JSON se regeneran con este script y no se editan a mano.

Además de la ficha, cada lectura puede tener un archivo comprension.json (en la misma carpeta)
con preguntas de selección múltiple de comprensión, escritas a mano a partir de la lectura y de lo
que enfatizó el profesor en clase. Ese archivo SÍ se edita a mano; el script lo valida y lo
incorpora al banco como preguntas de tipo "mcq" (de 4 a 6 opciones) o "vfbloque" (bloque de afirmaciones V/F).

Uso: python3 scripts/build_banco.py [--check]
  --check: no escribe; solo imprime conteos y anomalías.
"""
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONTENIDO = RAIZ / "content"
SALIDA = CONTENIDO / "banco"

SEC_PREGUNTAS = "Preguntas modelo"
SEC_TRAMPAS = "Trampas probables"
SEC_PARES = "Pares que se confunden"

RE_ITEM = re.compile(r"^(\d+)\.\s+(.*)$")
RE_PAG = re.compile(r"\bpp?\.\s*\d+(?:\s*(?:[-–]|y|,)\s*\d+)*")
RE_VEREDICTO = re.compile(r"^(Verdadero|Verdadera|Falso|Falsa)\b[\s:;,.]*(.*)$", re.S)


def secciones(lineas):
    """Devuelve {titulo_de_seccion: [lineas]} para los encabezados '## '."""
    out, actual = {}, None
    for ln in lineas:
        if ln.startswith("## "):
            actual = ln[3:].strip()
            out[actual] = []
        elif actual is not None:
            out[actual].append(ln.rstrip("\n"))
    return out


def buscar(secs, prefijo):
    for titulo, cuerpo in secs.items():
        if titulo.startswith(prefijo):
            return cuerpo
    return None


def items_numerados(cuerpo):
    """Agrupa líneas numeradas y sus continuaciones. Devuelve (items, grupos, sueltas).
    items: lista de (numero, texto, grupo). sueltas: líneas no vacías que no encajan."""
    items, grupo, sueltas = [], None, []
    for ln in cuerpo:
        s = ln.strip()
        if not s:
            continue
        m = RE_ITEM.match(s)
        if m:
            items.append([int(m.group(1)), m.group(2).strip(), grupo])
            continue
        if s.startswith(("Formato:", "Formato ")):
            continue
        if items and (ln.startswith("   ") or ln.startswith("\t")):
            items[-1][1] += " " + s
            continue
        # Línea sin número: encabezado de grupo de trampas.
        grupo = s.rstrip(":").strip("*_ ")
    return items, sueltas


def parentesis_final(texto):
    """Separa 'enunciado (respuesta)' tomando el último paréntesis balanceado
    que cierra al final del texto. Devuelve (enunciado, respuesta) o (texto, None)."""
    t = texto.rstrip()
    if not t.endswith(")"):
        return t, None
    prof = 0
    for i in range(len(t) - 1, -1, -1):
        if t[i] == ")":
            prof += 1
        elif t[i] == "(":
            prof -= 1
            if prof == 0:
                return t[:i].rstrip(), t[i + 1:-1].strip()
    return t, None


def paginas(texto):
    if not texto:
        return None
    m = RE_PAG.findall(texto)
    return "; ".join(x.strip() for x in m) if m else None


def parsear_preguntas(cuerpo, base, anomalias):
    items, _ = items_numerados(cuerpo)
    out = []
    for n, texto, _g in items:
        vf = False
        if texto.startswith("(V/F)"):
            vf = True
            texto = texto[5:].strip()
        enun, resp = parentesis_final(texto)
        p = {
            "id": f"{base}-q{len(out) + 1:03d}",
            "n_ficha": n,
            "tipo": "vf" if vf else "abierta",
            "enunciado": enun,
            "respuesta": resp,
            "referencia": paginas(resp),
        }
        if resp is None:
            anomalias.append(f"{base} pregunta {n}: sin respuesta")
        p["estado"] = "completa" if resp is not None else "sin_respuesta"
        if vf and resp is not None:
            m = RE_VEREDICTO.match(resp)
            if m:
                p["verdadera"] = m.group(1).lower().startswith("verdader")
                p["explicacion"] = m.group(2).strip()
            else:
                # El enunciado atribuye algo al texto y la respuesta matiza (p. ej. "El texto lo dice, pero...").
                p["verdadera"] = None
                p["explicacion"] = resp
        out.append(p)
    return out


def parsear_trampas(cuerpo, base, anomalias):
    items, _ = items_numerados(cuerpo)
    out = []
    for n, texto, grupo in items:
        out.append({
            "id": f"{base}-t{len(out) + 1:03d}",
            "n_ficha": n,
            "grupo": grupo,
            "texto": texto,
            "referencia": paginas(texto),
        })
    if not out:
        anomalias.append(f"{base}: sección de trampas sin ítems numerados")
    return out


def parsear_pares(cuerpo, base, anomalias):
    out = []
    for ln in cuerpo:
        s = ln.strip()
        if not s.startswith("|"):
            continue
        celdas = [c.strip() for c in s.strip("|").split("|")]
        if all(re.fullmatch(r":?-{2,}:?", c) for c in celdas if c):
            continue
        if celdas and celdas[0].lower() == "par":
            continue
        if len(celdas) < 2:
            anomalias.append(f"{base}: fila de pares con una sola celda: {s[:60]}")
            continue
        out.append({
            "id": f"{base}-p{len(out) + 1:03d}",
            "par": celdas[0],
            "diferencia": " | ".join(celdas[1:]),
        })
    return out


NIVELES = {"contraste", "aplicacion", "interpretacion", "calculo", "grafica", "causa"}
# Esquemas disponibles en app/src/components/Figura.tsx (una pregunta puede llevar "figura": <id>).
FIGURAS = {"iim", "rango", "vonthunen", "polese103", "hoyt", "costotransporte", "escalas", "areamercado"}
MIN_OPCIONES, MAX_OPCIONES = 4, 6  # el control usa de 4 a 6 opciones (a-f)


def parsear_comprension(ruta, base, anomalias):
    """Lee comprension.json y devuelve preguntas tipo 'mcq' ya normalizadas."""
    try:
        crudo = json.loads(ruta.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        anomalias.append(f"{base}: comprension.json inválido ({e})")
        return []
    if not isinstance(crudo, list):
        anomalias.append(f"{base}: comprension.json debe ser una lista")
        return []
    out = []
    n_mcq = n_bloque = n_comp = 0
    for i, c in enumerate(crudo, 1):
        if c.get("figura") is not None and c["figura"] not in FIGURAS:
            anomalias.append(f"{base}: figura desconocida {c['figura']!r}")
            continue
        if c.get("tipo") == "completar":
            n_comp += 1
            item = parsear_completar(c, f"{base}-c{n_comp:03d}", anomalias)
            if item:
                out.append(item)
            continue
        if c.get("tipo") == "vfbloque":
            n_bloque += 1
            item = parsear_bloque(c, f"{base}-b{n_bloque:03d}", anomalias)
            if item:
                out.append(item)
            continue
        n_mcq += 1
        pid = f"{base}-m{n_mcq:03d}"
        faltan = [k for k in ("enunciado", "opciones", "correcta", "explicacion", "errores", "concepto", "nivel")
                  if k not in c]
        if faltan:
            anomalias.append(f"{pid}: faltan campos {faltan}")
            continue
        ops, corr, errs = c["opciones"], c["correcta"], c["errores"]
        n = len(ops)
        if not MIN_OPCIONES <= n <= MAX_OPCIONES or len(set(ops)) != n:
            anomalias.append(f"{pid}: debe tener entre {MIN_OPCIONES} y {MAX_OPCIONES} opciones distintas")
            continue
        if not isinstance(corr, int) or not 0 <= corr < n:
            anomalias.append(f"{pid}: 'correcta' fuera de rango")
            continue
        if len(errs) != n or errs[corr] is not None or any(
                e is None or not str(e).strip() for j, e in enumerate(errs) if j != corr):
            anomalias.append(f"{pid}: 'errores' debe tener texto en cada incorrecta y null en la correcta")
            continue
        if c["nivel"] not in NIVELES:
            anomalias.append(f"{pid}: nivel desconocido {c['nivel']!r}")
            continue
        largo = max(range(n), key=lambda j: len(ops[j]))
        if largo == corr and len(ops[corr]) > 1.4 * sorted(len(o) for o in ops)[-2]:
            anomalias.append(f"{pid}: la opción correcta es mucho más larga que las demás (delata la respuesta)")
        out.append({
            "id": pid,
            "n_ficha": None,
            "tipo": "mcq",
            "enunciado": c["enunciado"].strip(),
            "opciones": ops,
            "correcta": corr,
            "errores": errs,
            "respuesta": ops[corr],
            "explicacion": c["explicacion"].strip(),
            "concepto": c["concepto"].strip(),
            "nivel": c["nivel"],
            "referencia": c.get("referencia"),
            "clase": c.get("clase"),
            **({"figura": c["figura"]} if c.get("figura") else {}),
            "estado": "completa",
        })
    return out


def parsear_bloque(c, pid, anomalias):
    """Bloque de afirmaciones V/F (como el control): enunciado + afirmaciones[{texto, verdadera, explicacion}]."""
    faltan = [k for k in ("enunciado", "afirmaciones", "concepto", "nivel") if k not in c]
    if faltan:
        anomalias.append(f"{pid}: faltan campos {faltan}")
        return None
    afs = c["afirmaciones"]
    if not isinstance(afs, list) or not 2 <= len(afs) <= 8:
        anomalias.append(f"{pid}: un bloque V/F lleva entre 2 y 8 afirmaciones")
        return None
    for j, a in enumerate(afs, 1):
        if (not isinstance(a, dict) or not str(a.get("texto", "")).strip()
                or not isinstance(a.get("verdadera"), bool) or not str(a.get("explicacion", "")).strip()):
            anomalias.append(f"{pid}: afirmación {j} necesita texto, 'verdadera' booleana y explicación")
            return None
    if c["nivel"] not in NIVELES:
        anomalias.append(f"{pid}: nivel desconocido {c['nivel']!r}")
        return None
    clave = " · ".join("V" if a["verdadera"] else "F" for a in afs)
    return {
        "id": pid,
        "n_ficha": None,
        "tipo": "vfbloque",
        "enunciado": c["enunciado"].strip(),
        "afirmaciones": [{"texto": a["texto"].strip(), "verdadera": a["verdadera"],
                          "explicacion": a["explicacion"].strip()} for a in afs],
        "respuesta": clave,
        "concepto": c["concepto"].strip(),
        "nivel": c["nivel"],
        "referencia": c.get("referencia"),
        "clase": c.get("clase"),
        **({"figura": c["figura"]} if c.get("figura") else {}),
        "estado": "completa",
    }


def parsear_completar(c, pid, anomalias):
    """Completar un texto o ubicar etiquetas en una figura. huecos[{id, correcta (índice en banco), explicacion}]."""
    faltan = [k for k in ("enunciado", "huecos", "banco", "concepto", "nivel") if k not in c]
    if faltan:
        anomalias.append(f"{pid}: faltan campos {faltan}")
        return None
    banco, huecos = c["banco"], c["huecos"]
    if not isinstance(banco, list) or not 3 <= len(banco) <= 10 or len(set(banco)) != len(banco):
        anomalias.append(f"{pid}: el banco lleva entre 3 y 10 términos distintos")
        return None
    if not isinstance(huecos, list) or not 2 <= len(huecos) <= 8:
        anomalias.append(f"{pid}: un ejercicio de completar lleva entre 2 y 8 huecos")
        return None
    ids = [str(h.get("id", "")) for h in huecos]
    if len(set(ids)) != len(ids) or "" in ids:
        anomalias.append(f"{pid}: los huecos necesitan ids distintos")
        return None
    usados = []
    for h in huecos:
        corr = h.get("correcta")
        if not isinstance(corr, int) or not 0 <= corr < len(banco) or not str(h.get("explicacion", "")).strip():
            anomalias.append(f"{pid}: hueco {h.get('id')!r} necesita 'correcta' dentro del banco y explicación")
            return None
        usados.append(corr)
    if len(set(usados)) != len(usados):
        anomalias.append(f"{pid}: dos huecos comparten la misma respuesta; cada término del banco sirve para un hueco")
        return None
    texto = c.get("texto")
    if texto is not None:
        import re
        marcas = re.findall(r"\{([^}]+)\}", texto)
        if sorted(marcas) != sorted(ids):
            anomalias.append(f"{pid}: los {{id}} del texto no coinciden con los huecos")
            return None
    elif not c.get("figura"):
        anomalias.append(f"{pid}: sin texto debe llevar figura (los huecos son puntos de la figura)")
        return None
    if c["nivel"] not in NIVELES:
        anomalias.append(f"{pid}: nivel desconocido {c['nivel']!r}")
        return None
    return {
        "id": pid,
        "n_ficha": None,
        "tipo": "completar",
        "enunciado": c["enunciado"].strip(),
        **({"texto": texto.strip()} if texto else {}),
        "banco": banco,
        "huecos": [{"id": str(h["id"]), "correcta": h["correcta"], "explicacion": h["explicacion"].strip()} for h in huecos],
        "respuesta": " · ".join(f"{h['id']} = {banco[h['correcta']]}" for h in huecos),
        "concepto": c["concepto"].strip(),
        "nivel": c["nivel"],
        "referencia": c.get("referencia"),
        "clase": c.get("clase"),
        **({"figura": c["figura"]} if c.get("figura") else {}),
        **({"ocultos": c["ocultos"]} if c.get("ocultos") else {}),
        "estado": "completa",
    }


def metadatos_lectura(carpeta_semana, carpeta_lectura):
    """Busca la entrada de lecturas.json cuyo campo 'ficha' apunta a esta carpeta."""
    ruta = carpeta_semana / "lecturas.json"
    if not ruta.exists():
        return {}
    datos = json.loads(ruta.read_text(encoding="utf-8"))
    for lec in datos.get("lecturas", []):
        if str(lec.get("ficha", "")).startswith(carpeta_lectura.name + "/"):
            return {"autor": lec.get("autor"), "titulo": lec.get("titulo"),
                    "alcance": lec.get("alcance")}
    return {}


def main():
    solo_check = "--check" in sys.argv
    anomalias, indice, total = [], [], {"preguntas": 0, "trampas": 0, "pares": 0, "mcq": 0, "vfbloque": 0, "completar": 0}
    for carpeta_semana in sorted(CONTENIDO.glob("semana-*")):
        semana = int(carpeta_semana.name.split("-")[1])
        for ficha in sorted(carpeta_semana.glob("*/ficha.md")):
            lectura = ficha.parent.name
            base = f"s{semana:02d}-{lectura}"
            secs = secciones(ficha.read_text(encoding="utf-8").splitlines())
            c_preg, c_tram, c_par = (buscar(secs, SEC_PREGUNTAS), buscar(secs, SEC_TRAMPAS),
                                     buscar(secs, SEC_PARES))
            if c_preg is None:
                anomalias.append(f"{base}: falta la sección '{SEC_PREGUNTAS}'")
            if c_tram is None:
                anomalias.append(f"{base}: falta la sección '{SEC_TRAMPAS}'")
            preguntas = parsear_preguntas(c_preg or [], base, anomalias)
            trampas = parsear_trampas(c_tram or [], base, anomalias)
            pares = parsear_pares(c_par or [], base, anomalias) if c_par else []
            ruta_comp = ficha.parent / "comprension.json"
            if ruta_comp.exists():
                preguntas += parsear_comprension(ruta_comp, base, anomalias)
            meta = metadatos_lectura(carpeta_semana, ficha.parent)
            doc = {
                "semana": semana,
                "lectura": lectura,
                "autor": meta.get("autor"),
                "titulo": meta.get("titulo"),
                "alcance": meta.get("alcance"),
                "fuente": str(ficha.relative_to(RAIZ)),
                "preguntas": preguntas,
                "trampas": trampas,
                "pares": pares,
            }
            if not solo_check:
                destino = SALIDA / f"semana-{semana:02d}" / f"{lectura}.json"
                destino.parent.mkdir(parents=True, exist_ok=True)
                destino.write_text(json.dumps(doc, ensure_ascii=False, indent=1) + "\n",
                                   encoding="utf-8")
            fila = {"semana": semana, "lectura": lectura, "autor": meta.get("autor"),
                    "titulo": meta.get("titulo"),
                    "archivo": f"semana-{semana:02d}/{lectura}.json",
                    "preguntas": len(preguntas), "trampas": len(trampas), "pares": len(pares),
                    "respondibles": sum(p["estado"] == "completa" for p in preguntas),
                    "mcq": sum(p["tipo"] == "mcq" for p in preguntas),
                    "vfbloque": sum(p["tipo"] == "vfbloque" for p in preguntas),
                    "completar": sum(p["tipo"] == "completar" for p in preguntas),
                    "vf": sum(p["tipo"] == "vf" for p in preguntas),
                    "vf_directas": sum(p["tipo"] == "vf" and isinstance(p.get("verdadera"), bool)
                                       for p in preguntas)}
            indice.append(fila)
            for k in total:
                total[k] += fila[k]
            print(f"s{semana:02d} {lectura:42s} preg={len(preguntas):3d} "
                  f"vf={sum(p['tipo'] == 'vf' for p in preguntas):3d} "
                  f"mcq={fila['mcq']:3d} bloq={fila['vfbloque']:2d} "
                  f"tramp={len(trampas):3d} pares={len(pares):3d}")
    print("TOTAL", total)
    if not solo_check:
        SALIDA.mkdir(parents=True, exist_ok=True)
        (SALIDA / "index.json").write_text(
            json.dumps({"totales": total, "lecturas": indice}, ensure_ascii=False, indent=1) + "\n",
            encoding="utf-8")
    print(f"Anomalías: {len(anomalias)}")
    for a in anomalias:
        print("  -", a)


if __name__ == "__main__":
    main()
