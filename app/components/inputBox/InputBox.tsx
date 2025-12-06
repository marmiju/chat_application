interface Props {
    label: string
    type: 'text' | 'email' | 'password'
    placeholder: string
    required: boolean
    name: string
    minlen?:number
}

const InputBox = ({ label, type, placeholder, required, name, minlen }: Props) => {
    return (
        <div className="flex flex-col py-1 space-y-1">
            <label className="text-[12px]  text-black" htmlFor="">{`${label} ${required ? '*' : ''}`}</label>
            <input
            min={minlen}
                className=" p-2 border border-gray-400 rounded focus:border-purple-600"
                name={name} type={type} required={required} placeholder={placeholder} />
        </div>
    )
}

export default InputBox