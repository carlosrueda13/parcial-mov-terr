#!/usr/bin/env python3
"""Extrae de las fichas (content/semana-NN/<lectura>/ficha.md) el banco estructurado:
preguntas modelo, trampas probables y pares que se confunden.

Salida: content/banco/<semana>/<lectura>.json y content/banco/index.json.
La ficha es la fuente; los JSON se regeneran con este script y no se editan a mano.

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
    anomalias, indice, total = [], [], {"preguntas": 0, "trampas": 0, "pares": 0}
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
                    "vf": sum(p["tipo"] == "vf" for p in preguntas),
                    "vf_directas": sum(p["tipo"] == "vf" and isinstance(p.get("verdadera"), bool)
                                       for p in preguntas)}
            indice.append(fila)
            for k in total:
                total[k] += fila[k]
            print(f"s{semana:02d} {lectura:42s} preg={len(preguntas):3d} "
                  f"vf={sum(p['tipo'] == 'vf' for p in preguntas):3d} "
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
