
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

import {
  DataTableComponent,
  TableColumn,
  TablePage
} from '../../../../../core/components/data-table/data-table';

import { FilterPanelComponent } from '../../../../../core/components/filter-panel/filter-panel';

import {
  LocalTable,
  toYMD,
  fmtDMY,
  inDateRange,
  textIncludes
} from '../../../../../core/utils/local-table';

import { UserFormModal } from '../../modals/user-form-modal/user-form-modal';

interface UserRow extends Record<string, any> {
  id: number;
  fecha: string;
  fechaOrden: string;
  nombre: string;
  documento: string;
  email: string;
  perfil: string;
  perfilId: number;
  estado: 'activo' | 'inactivo';
  raw: any;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  filterOpen = false;

  private rawUsers: any[] = [];

  profiles: Record<number, string> = {
    1: 'Administrador',
    2: 'Auxiliar',
    3: 'Afiliado',
    4: 'Coordinador de mantenimiento',
  };

  columns: TableColumn[] = [
    {
      key: 'fecha',
      label: 'Fecha de creación',
      sortable: false
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'documento',
      label: 'Documento',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true
    },
    {
      key: 'perfil',
      label: 'Perfil',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      format: 'badge',
      badgeMap: {
        activo: {
          label: 'Activo',
          class: 'badge-active'
        },
        inactivo: {
          label: 'Inactivo',
          class: 'badge-inactive'
        }
      }
    }
  ];

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  table = new LocalTable<UserRow>({
    searchKeys: [
      'fecha',
      'nombre',
      'documento',
      'email',
      'perfil',
      'estado'
    ],
    labels: {
      estado: value =>
        value === 'activo' ? 'Activo' : 'Inactivo'
    },
    defaultSort: {
      key: 'fechaOrden',
      dir: 'desc'
    },
    tieKey: 'id'
  });

  filters = this.emptyFilters();

  private emptyFilters() {
    return {
      nombre: '',
      documento: '',
      email: '',
      perfil: '',
      estado: '',
      fechaDesde: '',
      fechaHasta: ''
    };
  }

  ngOnInit(): void {
    this.load();
  }

  private isActive(value: any): boolean {
    return value === true ||
      value === 1 ||
      value === '1' ||
      (
        typeof value === 'string' &&
        value.toLowerCase() === 'true'
      );
  }

  load(): void {
    this.loading = true;

    this.api.getAuth(ENDPOINTS.USERS.LIST).subscribe({
      next: (response: any) => {
        let data = response;

        for (let i = 0; i < 3; i++) {
          if (Array.isArray(data)) break;

          if (Array.isArray(data?.data)) {
            data = data.data;
            break;
          }

          if (data?.data && typeof data.data === 'object') {
            data = data.data;
            continue;
          }

          break;
        }

        if (!Array.isArray(data)) {
          console.error('Respuesta inesperada de usuarios:', response);
          data = [];
        }

        this.rawUsers = data;

        const rows: UserRow[] = data.map((u: any) => {
          const fechaCreacion =
            u.create_at ??
            u.created_at ??
            u.createdAt;

          const perfilId = Number(u.role);

          return {
            id: Number(u.id),
            fecha: fmtDMY(fechaCreacion),
            fechaOrden: toYMD(fechaCreacion),
            nombre: `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim(),
            documento: String(u.document_number ?? '').trim(),
            email: String(u.email ?? '').trim(),
            perfil: this.profiles[perfilId] ?? '—',
            perfilId,
            estado: this.isActive(u.active) ? 'activo' : 'inactivo',
            raw: u
          };
        });

        this.table.setData(rows);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.toast.error('No se pudieron cargar los usuarios');
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    const f = this.filters;

    this.table.setFilter((r: UserRow) => {
      if (!textIncludes(r.nombre, f.nombre)) return false;
      if (!textIncludes(r.documento, f.documento)) return false;
      if (!textIncludes(r.email, f.email)) return false;

      if (f.perfil && String(r.perfilId) !== f.perfil) {
        return false;
      }

      if (f.estado && r.estado !== f.estado) {
        return false;
      }

      if (!inDateRange(
        r.fechaOrden,
        f.fechaDesde,
        f.fechaHasta
      )) {
        return false;
      }

      return true;
    });

    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();
    this.table.setFilter(null);
    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  get activeFilterCount(): number {
    return Object.values(this.filters)
      .filter(value => value !== '').length;
  }

  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  onAction(event: { action: string; row: UserRow }): void {
    const user = this.rawUsers.find(
      u => Number(u.id) === event.row.id
    );

    if (!user) return;

    if (event.action === 'edit') {
      this.edit(user);
    }

    if (event.action === 'delete') {
      this.confirmDelete(user);
    }
  }

  openModal(): void {
    const ref = this.dialog.open(UserFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '680px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  edit(item: any): void {
    const ref = this.dialog.open(UserFormModal, {
      data: item,
      panelClass: 'dialog-panel',
      width: '680px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  confirmDelete(item: any): void {
    const nombre = `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim();

    if (!confirm(`¿Eliminar usuario "${nombre}"?`)) return;

    this.api.deleteAuth(
      ENDPOINTS.USERS.DELETE(item.id)
    ).subscribe({
      next: () => {
        this.toast.success('Usuario eliminado');
        this.load();
      },
      error: (error: any) => {
        console.error('Error al eliminar usuario:', error);
        this.toast.error('Error al eliminar el usuario');
      }
    });
  }
}
