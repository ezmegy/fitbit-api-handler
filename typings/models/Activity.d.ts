import { Workout, WorkoutConstructor } from 'fitness-models';
import { DateTime, Duration } from 'luxon';
import { Unit } from 'mathjs';
import { ActivityType } from '../constants/activity-types';
import { ApiActivity } from '../types/api';
interface Constructor<Id, ApiSource> extends WorkoutConstructor {
    id: Id;
    source: ApiSource;
    steps?: number;
    tcxLink?: string;
    typeId: ActivityType;
    typeName?: string;
}
export default class Activity<Id extends number | undefined = any, ApiSource extends ApiActivity | undefined = any> extends Workout {
    protected typeId: ActivityType;
    protected typeName?: string;
    protected id: Id;
    protected steps?: number;
    protected tcxLink?: string;
    protected source: ApiSource;
    constructor(options: Constructor<Id, ApiSource>);
    static fromApi(activity: ApiActivity): Activity<number, ApiActivity>;
    static get(typeId: ActivityType, start: DateTime, duration: Duration, distance?: Unit, calories?: number): Activity<undefined, undefined>;
    protected clone(extension: Partial<Constructor<number | undefined, ApiSource>>): this;
    getId(): Id;
    setId(id: number): Activity<number, ApiSource>;
    setId(id: undefined): Activity<undefined, ApiSource>;
    getTypeId(): ActivityType;
    getTypeName(): string;
    getSource(): ApiSource;
    getSteps(): number | undefined;
    getTcxLink(): string | undefined;
    toString(): string;
    toObject(): Constructor<Id, ApiSource>;
}
export {};
