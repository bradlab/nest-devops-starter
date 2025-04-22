import { Person } from "database/abstract/model.abstract";
import { SexEnum } from "../enum";

export abstract class IBasicPersonnalInfoDTO
  implements Omit<Person, 'id' | 'createdAt' | 'updatedAt' | 'isActivated'>
{
  firstname: string;
  lastname: string;
  phone: string;
  sex?: SexEnum;
  email?: string;
  address?: string;
}
export interface IUpdatePersonDTO extends Partial<IBasicPersonnalInfoDTO> {
  id: string;
}
