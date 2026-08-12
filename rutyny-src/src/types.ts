export interface Routine { id:string; numer:number; poraDnia:string; tytul:string; polecenie:string; checkboxy:string[]; wskazowka:string; bohater:string; aktywna:boolean; ilustracja:string }
export interface DayRecord { date:string; checks:Record<string, boolean[]> }
export interface Settings { active:Record<string, boolean>; order:string[]; soundEnabled:boolean }
export interface BackupData { version:1; exportedAt:string; days:DayRecord[]; settings:Settings }
