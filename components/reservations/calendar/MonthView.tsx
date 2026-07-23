"use client";

export function MonthView(){

    return(

        <div className="p-6">

            <h2 className="text-xl font-bold mb-6">
                Calendario
            </h2>

            <div
                className="
                    grid
                    grid-cols-7
                    gap-2
                "
            >

                {Array.from({length:35}).map((_,i)=>(

                    <div
                        key={i}
                        className="
                            h-32
                            rounded-lg
                            border
                            hover:bg-orange-50
                            transition
                            cursor-pointer
                            p-2
                        "
                    >

                        <span className="text-sm text-gray-500">

                            {i+1}

                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}
