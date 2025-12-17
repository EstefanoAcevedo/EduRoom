import { SubjectsInterface } from "../subjects/subjects-interface";

export interface CareerInterface {
    career_id?: number,
    career_name: string,
    career_alias: string,
    created_at?: string,
    updated_at?: string,
    subjects?: SubjectsInterface[]
}
