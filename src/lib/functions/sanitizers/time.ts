import { format, formatDistance, formatRelative, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/*
Classe utilitária que lida com formatação de data
*/
class HandleDate{
    
    /**
     * Função para formatar uma data em um formato específico.
     * 
     * @param {Date} date - A data a ser formatada.
     * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data.
     * @returns {string} - A data formatada como uma string.
     */
      formatDate = (date: Date, dateFormat: string = 'dd/MM/yyyy'): string => {
        date.setDate(date.getDate()+1);
        return format(new Date(date), dateFormat, { locale: ptBR });
    };
    
    /**
     * Função para formatar uma data com base na distância de tempo até o presente.
     * 
     * @param {Date} date - A data a ser comparada com o presente.
     * @returns {string} - A distância de tempo até o presente, formatada como uma string.
     */
    formatDistanceToNow = (date: Date) => {
        return formatDistance(new Date(date), new Date(), { addSuffix: true, locale: ptBR });
    };
    
    /**
     * Função para formatar uma data de forma relativa (ex: "há 3 dias", "em 2 semanas").
     * 
     * @param {Date} date - A data a ser formatada de forma relativa.
     * @param {Date} [baseDate=new Date()] - A data base para calcular a distância relativa.
     * @returns {string} - A data formatada de forma relativa, como uma string.
     */
    formatRelativeDate = (date: Date, baseDate = new Date()) => {
        return formatRelative(new Date(date), baseDate, { locale: ptBR });
    };
    
      /**
     * Função para adicionar dias a uma data.
     * 
     * @param {Date} date - A data original.
     * @param {number} days - O número de dias a serem adicionados.
     * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data resultante.
     * @returns {string} - A nova data, com os dias adicionados, formatada 
     */
    addDaysToDate = (date : Date, days : number, dateFormat : string = 'dd/MM/yyyy') => {
        return format(addDays(new Date(date), days), dateFormat);
    };

    /**
    * Função para converter uma string ISO em uma data formatada.
    * 
    * @param {string} isoDate - A string ISO a ser convertida em data.
    * @param {string} [dateFormat='dd/MM/yyyy'] - O formato desejado para a data resultante.
    * @returns {string} - A data formatada, convertida a partir da string ISO.
    */
    formatISODate = (isoDate: string, dateFormat: string = 'dd/MM/yyyy') => {
       const tmpDate = new Date(isoDate)
       tmpDate.setDate(tmpDate.getDate()+1)
       isoDate = tmpDate.toISOString()
       return format(parseISO(isoDate), dateFormat,{ locale: ptBR });
    };
    tempoRelativo(dataString: string): string {
        const dataSistema = new Date();
        const dataRecebida = new Date(dataString);
    
        // Formatação do horário no padrão "hh:mm"
        const formatarHorario = (data: Date): string =>
            `${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
    
        // Verifica se a data é hoje
        if (
            dataRecebida.getDate() === dataSistema.getDate() &&
            dataRecebida.getMonth() === dataSistema.getMonth() &&
            dataRecebida.getFullYear() === dataSistema.getFullYear()
        ) {
            return formatarHorario(dataRecebida);
        }
    
        // Verifica se a data está na mesma semana
        const diaSemanaDataSistema = dataSistema.getDay();
        const inicioDaSemana = new Date(dataSistema);
        inicioDaSemana.setDate(dataSistema.getDate() - diaSemanaDataSistema); // Primeiro dia da semana (domingo)
    
        const fimDaSemana = new Date(dataSistema);
        fimDaSemana.setDate(dataSistema.getDate() + (6 - diaSemanaDataSistema)); // Último dia da semana (sábado)
    
        if (dataRecebida >= inicioDaSemana && dataRecebida <= fimDaSemana) {
            const diasDaSemana = [
                'Domingo',
                'Segunda-Feira',
                'Terça-Feira',
                'Quarta-Feira',
                'Quinta-Feira',
                'Sexta-Feira',
                'Sábado',
            ];
            const diaSemana = diasDaSemana[dataRecebida.getDay()];
            return `${diaSemana} às ${formatarHorario(dataRecebida)}`;
        }
    
        // Caso contrário, retorna no formato "20 de Out, às 09:12"
        const meses = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
        ];
        const dia = dataRecebida.getDate();
        const mes = meses[dataRecebida.getMonth()];
        return `${dia} de ${mes}, às ${formatarHorario(dataRecebida)}`;
    }
    
}

const handleDate = new HandleDate();
export default handleDate;