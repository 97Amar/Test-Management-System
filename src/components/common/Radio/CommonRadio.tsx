import { Field, useFormikContext } from 'formik';

interface RadioOption {
    value: string | number;
    label: string;
}

interface Props {
    label: string;
    name: string;
    options: RadioOption[];
    inline?: boolean;
}

const CommonRadio = ({ label, name, options, inline = false }: Props) => {
    const { errors, touched } = useFormikContext<Record<string, any>>();
    const hasError = touched[name] && errors[name];

    return (
        <div className="form-group-custom">
            <label>{label}</label>
            <div className={`d-flex ${inline ? 'flex-row gap-4' : 'flex-column gap-2'}`}>
                {options.map((opt) => (
                    <div key={opt.value} className="form-check">
                        <Field
                            type="radio"
                            id={`${name}-${opt.value}`}
                            name={name}
                            value={String(opt.value)}
                            className="form-check-input"
                        />
                        <label
                            htmlFor={`${name}-${opt.value}`}
                            className="form-check-label"
                            style={{ fontWeight: 400 }}
                        >
                            {opt.label}
                        </label>
                    </div>
                ))}
            </div>
            {hasError && <span className="error-msg">{String(errors[name])}</span>}
        </div>
    );
};

export default CommonRadio;
