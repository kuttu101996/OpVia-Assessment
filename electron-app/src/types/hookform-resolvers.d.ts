declare module '@hookform/resolvers/yup' {
  import { Resolver } from 'react-hook-form';
  import { AnyObjectSchema } from 'yup';

  // Preserve generic typing from useForm<T>()
  export function yupResolver<TFieldValues extends Record<string, any>>(
    schema: AnyObjectSchema
  ): Resolver<TFieldValues, any>;
}
