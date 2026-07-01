import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanelComponent {

  @Input() open            = false;
  @Input() activeCount     = 0;
  @Input() title           = 'Filtros';
  @ContentChild('body') bodyTpl!: TemplateRef<any>;

  @Output() apply  = new EventEmitter<void>();
  @Output() clear  = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
}