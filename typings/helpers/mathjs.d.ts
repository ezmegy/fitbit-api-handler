import { MathArray, Matrix, Unit } from 'mathjs';
declare const mathjs: any;
export default mathjs;
export declare function unit(unitParam: string): Unit;
export declare function unit(value: number | MathArray | Matrix, unitParam: string): Unit;
