import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permiso {
  @Prop({ type: Boolean })
  create!: boolean;

  @Prop({ type: Boolean })
  edit!: boolean;

  @Prop({ type: Boolean })
  delete!: boolean;

  @Prop({ type: Boolean })
  activate!: boolean;

  @Prop({ type: Boolean })
  read!: boolean;

  @Prop({ type: Boolean })
  active!: boolean;

  @Prop({ type: Boolean })
  standout!: boolean;

  @Prop({ type: Boolean })
  save!: boolean;

  @Prop({ type: Boolean })
  background!: boolean;

  @Prop({ type: Boolean })
  banner!: boolean;

  @Prop({ type: Boolean })
  channel!: boolean;

  @Prop({ type: Boolean })
  category!: boolean;
}

export const PermisoSchema = SchemaFactory.createForClass(Permiso);

@Schema()
export class ListRutas {
  @Prop({ type: Number })
  idPadre!: number;

  @Prop({ type: Boolean })
  isInternal!: boolean;

  @Prop({ type: String })
  nombre!: string;

  @Prop({ type: String })
  ruta!: string;

  @Prop({ type: PermisoSchema })
  permiso!: Permiso;
}

export const ListRutasSchema = SchemaFactory.createForClass(ListRutas);

@Schema()
export class ListRoutes {
  @Prop({ type: Number })
  id!: number;

  @Prop({ type: String })
  nombreModulo!: string;

  @Prop({ type: [ListRutasSchema] })
  listRutas!: ListRutas[];
}

export const ListRoutesSchema = SchemaFactory.createForClass(ListRoutes);

@Schema()
export class ListModules {
  @Prop({ type: String })
  id!: string;

  @Prop({ type: String })
  modulo!: string;

  @Prop({ type: Boolean })
  active!: boolean;
}

export const ListModulesSchema = SchemaFactory.createForClass(ListModules);

@Schema()
export class Role extends Document {
  @Prop({ type: String })
    name!: string;

  @Prop({ type: [ListRoutesSchema] })
    listRoutes!: ListRoutes[];

  @Prop({ type: [ListModulesSchema] })
    listModules!: ListModules[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
