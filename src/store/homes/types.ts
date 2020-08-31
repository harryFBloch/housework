import { ActionType } from '../actionTypes';

export type Reminder = {daysBefore: number, id: string, deleted: boolean}
export type Reminders = {[id: string]: Reminder}

export const ReminderTemplate: Reminder = {daysBefore: 1, id: '', deleted: false}

export interface Task {
  id: string,
  name: string,
  cleanInterval: number,
  lastCleaned: string,
  cleanedHistory: string[],
  isDeleted: boolean,
}

export interface Room {
  id: string,
  name: string,
  tasks: {[id: string]: Task}
  isDeleted: boolean,
}

export interface Home {
  id: string,
  name: string,
  rooms: {[id: string]: Room},
  owner: string,
  isDeleted: boolean,
}

export type Homes = {[id: string]: Home}



export type HomesAction = 
{ type: ActionType.GET_HOMES, homes: Homes } 
  
  