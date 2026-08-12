export interface Routine { id:string; numer:number; poraDnia:string; tytul:string; polecenie:string; checkboxy:string[]; wskazowka:string; bohater:string; aktywna:boolean; ilustracja:string }
export interface DayRecord { date:string; checks:Record<string, boolean[]> }
export interface Settings { active:Record<string, boolean>; order:string[]; soundEnabled:boolean }
export interface Profile { id:string; name:string; color:string; createdAt:string }
export interface BackupDataV1 { version:1; exportedAt:string; days:DayRecord[]; settings:Settings }
export interface ProfileBackup { profile:Profile; days:DayRecord[]; settings:Settings }
export interface BackupData { version:2; exportedAt:string; profiles:ProfileBackup[] }
