import { TablePage } from '../components/data-table/data-table';

/**
 * Tabla en memoria para app-data-table.
 * Para listados que el backend devuelve completos (maestros): búsqueda por
 * columna, filtros, orden y paginación se hacen en el navegador.
 *
 *   table = new LocalTable<Row>({
 *     searchKeys: ['creado', 'nit', 'nombre'],
 *     labels: { creado: fmtDMY, estado: v => v === 'activo' ? 'Activo' : 'Inactivo' },
 *     defaultSort: { key: 'creado', dir: 'desc' },
 *     tieKey: 'id',
 *   });
 *   table.setData(lista);                 // al cargar
 *   table.setParams(params);              // en (pageChange) de app-data-table
 *   table.setFilter(r => ...);            // al aplicar filtros
 *
 *   <app-data-table [data]="table.rows" [total]="table.total" ...>
 */
export interface LocalTableOptions {
  /** Columnas donde busca "Todas las columnas" */
  searchKeys: string[];
  /** Texto visible de una columna (fechas, badges): se usa para BUSCAR como lo ve el usuario */
  labels?: Record<string, (value: any) => string>;
  /** Orden cuando el usuario no ha elegido columna */
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  /** Desempate cuando dos filas valen lo mismo (más reciente primero) */
  tieKey?: string;
}

export class LocalTable<T extends Record<string, any>> {

  rows: T[] = [];
  total = 0;

  private all: T[] = [];
  private filterFn: ((row: T) => boolean) | null = null;
  private params: TablePage = { page: 1, limit: 10, search: '', column: '', sortBy: '', sortDir: 'asc' };

  constructor(private opts: LocalTableOptions) {}

  /** Lista completa (todas las filas) */
  get data(): T[] { return this.all; }

  setData(list: T[]): void {
    this.all = Array.isArray(list) ? list : [];
    this.refresh();
  }

  /** Lo que emite app-data-table en (pageChange) */
  setParams(params: TablePage): void {
    this.params = params;
    this.refresh();
  }

  /** Filtro del panel (null = sin filtro). Vuelve a la página 1. */
  setFilter(fn: ((row: T) => boolean) | null): void {
    this.filterFn = fn;
    this.params = { ...this.params, page: 1 };
    this.refresh();
  }

  /** Valores únicos de una columna (para llenar selects del panel) */
  options(key: string): string[] {
    return [...new Set(this.all.map(r => r[key]).filter(v => v !== null && v !== undefined && v !== ''))]
      .map(String)
      .sort((a, b) => a.localeCompare(b, 'es'));
  }

  private text(row: T, key: string): string {
    const v = row[key];
    const label = this.opts.labels?.[key];
    if (label) return label(v) ?? '';
    return v === null || v === undefined ? '' : String(v);
  }

  /** Compara valores crudos (fechas ISO, números y textos ordenan bien así) */
  private compare(a: any, b: any): number {
    const ea = a === null || a === undefined || a === '';
    const eb = b === null || b === undefined || b === '';
    if (ea && eb) return 0;
    if (ea) return 1;
    if (eb) return -1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b), 'es', { numeric: true });
  }

  refresh(): void {
    const p = this.params;
    let list = this.all;

    if (this.filterFn) list = list.filter(this.filterFn);

    const q = (p.search ?? '').trim().toLowerCase();
    if (q) {
      const keys = p.column ? [p.column] : this.opts.searchKeys;
      list = list.filter(r => keys.some(k => this.text(r, k).toLowerCase().includes(q)));
    }

    const key = p.sortBy || this.opts.defaultSort?.key;
    if (key) {
      const dir = (p.sortBy ? p.sortDir : this.opts.defaultSort?.dir) === 'desc' ? -1 : 1;
      const tie = this.opts.tieKey;
      list = [...list].sort((a, b) => {
        const va = a[key], vb = b[key];
        const emptyA = va === null || va === undefined || va === '';
        const emptyB = vb === null || vb === undefined || vb === '';
        // Vacíos siempre al final, sin importar la dirección
        if (emptyA !== emptyB) return emptyA ? 1 : -1;
        const c = this.compare(va, vb) * dir;
        if (c !== 0 || !tie) return c;
        return this.compare(b[tie], a[tie]);   // desempate: el más reciente primero
      });
    }

    this.total = list.length;
    const limit = Number(p.limit) || 10;
    const maxPage = Math.max(1, Math.ceil(this.total / limit));
    const page = Math.min(Math.max(1, Number(p.page) || 1), maxPage);
    this.rows = list.slice((page - 1) * limit, page * limit);
  }
}

// ═══ Ayudas para fechas y filtros de los maestros ════════════════════════

/** Fecha en hora local como 'AAAA-MM-DD' (para comparar con <input type="date">) */
export function toYMD(value: any): string {
  if (!value) return '';
  const s = String(value);
  // Fechas sin hora ('2026-10-16') se toman tal cual, sin corrimiento de zona
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Fecha como 'dd/mm/aaaa' (para buscar igual a como se ve en la tabla) */
export function fmtDMY(value: any): string {
  const ymd = toYMD(value);
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-');
  return `${d}/${m}/${y}`;
}

/** ¿La fecha está dentro del rango desde/hasta (ambos opcionales, 'AAAA-MM-DD')? */
export function inDateRange(value: any, from: string, to: string): boolean {
  if (!from && !to) return true;
  const ymd = toYMD(value);
  if (!ymd) return false;
  if (from && ymd < from) return false;
  if (to && ymd > to) return false;
  return true;
}

/** Contiene el texto, sin importar mayúsculas ni tildes */
export function textIncludes(value: any, query: string): boolean {
  if (!query) return true;
  const norm = (s: any) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return norm(value).includes(norm(query.trim()));
}