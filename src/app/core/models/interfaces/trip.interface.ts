export interface Movement {
  id: number;
  fecha: string;
  empresaTransporte: string;
  placa: string;
  contenedor: string;
  tamano: string;
  cliente: string;
  linea: string;
  origen: string;
  destino: string;
  operacion: string;
  conductor: string;
  estado: string;
  flete: number;
  comisionPagada: number;
  estadoTrabajo: string;
  afiliado: string;
  auxiliarTransporte: string;
  transporteComida: number;
  observacion: string;
  fechaEnvioFacturar: string;
}