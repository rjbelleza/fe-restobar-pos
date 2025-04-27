
const Card = ({ category, value, color}) => {

    return (
        <div className="relative h-full w-full flex items-center justify-center shadow-md shadow-gray-600 space-y-2 border-1 border-primary 
                        hover:scale-105 transition-all rounded-md gap-5"
        >
            <div className="absolute flex flex-col gap-2 w-1/2 h-full justify-center items-center">
                <div className="w-[200px]"></div>
                <p className="font-medium w-fit px-2 py-1 rounded-sm text-[13px] text-white"
                style={{backgroundColor: color}}
                >{category}</p>
                <p className="text-[25px] font-medium text-primary">{value}</p>
            </div>
        </div>
    );
}   

export default Card;
