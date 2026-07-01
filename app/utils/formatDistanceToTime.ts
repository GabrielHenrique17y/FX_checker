import { formatDistanceStrict, format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export function formatDistanceToTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);

  const diffDays = (now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24);

  // Mais de 30 dias → exibir data em inglês (MAY, JULY, etc.)
  if (diffDays > 30) {
    return format(past, 'dd MMM', { locale: enUS }).toUpperCase();
  }

  let result = formatDistanceStrict(past, now, { locale: ptBR });

  result = result
    .replace(/segundo(s)?/g, 'S')
    .replace(/minuto(s)?/g, 'M')
    .replace(/hora(s)?/g, 'H')
    .replace(/dia(s)?/g, 'D')
    .replace(/\s/g, '');
  return result;
}
