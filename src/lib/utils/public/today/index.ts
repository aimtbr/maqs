import { Maqs } from 'src/entities/Maqs';

export const today = (): Maqs => {
  return new Maqs(new Date()).asLocal();
};
