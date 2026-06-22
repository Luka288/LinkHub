import { catchError, map, of, type Observable } from 'rxjs';

type FieldResult = { ok: true } | { ok: false; message: string };

export function toFieldResult<T>(
  source$: Observable<T>,
  fallbackMessage: string,
): Observable<FieldResult> {
  return source$.pipe(
    map((): FieldResult => ({ ok: true })),
    catchError((err) =>
      of<FieldResult>({
        ok: false,
        message: err.error?.error ?? fallbackMessage,
      }),
    ),
  );
}
