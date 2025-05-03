import { format, isTomorrow, isSameDay } from "date-fns"
import { DATE_COLORS } from "@/constants/Colors"

const getDateObject = (date: Date) => {
    if (isSameDay(date, new Date())) {
        return {
            name: 'Today',
            color: DATE_COLORS.today
        }
    }
    if (isTomorrow(new Date(date))) {
        return {
            name: 'Tomorrow',
            color: DATE_COLORS.tomorrow
        }
    }
    return {
        name: format(date, 'EEEE, d MMM'),
        color: DATE_COLORS.other
    }
}

export default getDateObject;