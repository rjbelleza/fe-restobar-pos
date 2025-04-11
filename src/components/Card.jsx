
const Card = ({url, category, value, range, color}) => {

    return (
        <div className="h-fit w-fit px-5 py-3 shadow-md shadow-gray-600 space-y-2 border-1 border-primary 
                        hover:scale-105 transition-all rounded-md"
             style={{backgroundImage: "url('src/assets/backgroundImages/" + url}}
        >
            <div className="w-[200px]"></div>
            <p className="font-medium w-fit px-2 py-1 rounded-sm text-[10px] text-white"
               style={{backgroundColor: color}}
            >{category}</p>
            <p className="text-[20px] font-medium text-primary">{value}</p>
            <p className="font-medium text-gray-700 text-[13px]">{range}</p>
        </div>
    );
}

export default Card;
