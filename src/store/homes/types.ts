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

export const TaskTemplate: Task = {
  id: '',
  name: '',
  cleanInterval: 0,
  lastCleaned: '',
  cleanedHistory: [],
  isDeleted: false
}

export interface Room {
  id: string,
  name: string,
  tasks: {[id: string]: Task}
  isDeleted: boolean,
}

export const RoomTemplate: Room = {
  id: '',
  name: '',
  tasks: {},
  isDeleted: false
}

export interface Home {
  id: string,
  name: string,
  rooms: {[id: string]: Room},
  owner: string,
  isDeleted: boolean,
}

export const HomeTemplate: Home = {
  id: '',
  name: '',
  rooms: {},
  owner: '',
  isDeleted: false
}

export type Homes = {[id: string]: Home}

export type HomesAction = 
{ type: ActionType.GET_HOMES, homes: Homes } | 
{ type: ActionType.SAVE_HOME, home: Home} | 
{ type: ActionType.COMPLETE_TASK, taskID: string, roomID: string, homeID: string}
  
  