import { dateIsBefore } from '../../Shared/checkDate';
import { ValueObject } from '../../Shared/value-object'


export type PeriodsCalendarEINAProps = {
    startFirstSemester: Date, endFirstSemester: Date, startSecondSemester: Date,
    endSecondSemester: Date, startSecondConvocatory: Date, endSecondConvocatory: Date;
};

export class PeriodsCalendarEINA extends ValueObject<PeriodsCalendarEINAProps> {

    protected validate(props: PeriodsCalendarEINAProps): void {
        if (dateIsBefore(props.startFirstSemester, props.endFirstSemester)) {
            //throw new (' is out of range');
        }
        if (dateIsBefore(props.endFirstSemester, props.startSecondSemester)) {
            //throw new (' is out of range');
        }
        if (dateIsBefore(props.startSecondSemester, props.endSecondSemester)) {
            //throw new (' is out of range');
        }
        if (dateIsBefore(props.endSecondSemester, props.startSecondConvocatory)) {
            //throw new (' is out of range');
        }
        if (dateIsBefore(props.startSecondConvocatory, props.endSecondConvocatory)) {
            //throw new (' is out of range');
        }
    }
    
}