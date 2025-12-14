import { CommissionInterface } from "../commissions/commission-interface";
import { SubjectsInterface } from "../subjects/subjects-interface";
import { UserInterface } from "../users/user-interface";

export interface EnrollmentInterface {
    enrollment_id: number;
    enrollment_academic_year: string;
    enrollment_status: string;
    user: UserInterface;
    subject: SubjectsInterface;
    commission: CommissionInterface;

    isApproving?: boolean;
    isRejecting?: boolean;
}
