import { forwardRef } from "react";
import NumberFormat from 'react-number-format';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}
//@ts-ignore
export const AccountFormat = forwardRef<NumberFormat, CustomProps>(
    function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                format="## #### #### #### #### #### ####"
                mask={"_"}
            />
        );
    },
);

//@ts-ignore
export const AmountFormat = forwardRef<NumberFormat, CustomProps>(
    function NumberFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumberFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator=" "
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
            />
        );
    },
);