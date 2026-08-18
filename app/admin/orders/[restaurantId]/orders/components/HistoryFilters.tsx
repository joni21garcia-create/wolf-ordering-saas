"use client";

interface Props {
  search: string;
  onSearch: (value: string) => void;

  from?: string;
  onFrom?: (value: string) => void;

  to?: string;
  onTo?: (value: string) => void;

  status?: string;
  onStatus?: (value: string) => void;

  payment?: string;
  onPayment?: (value: string) => void;

  orderType?: string;
  onOrderType?: (value: string) => void;

  onClear: () => void;
}

export default function HistoryFilters({
  search,
  onSearch,
  from,
  onFrom,
  to,
  onTo,
  status,
  onStatus,
  payment,
  onPayment,
  orderType,
  onOrderType,
  onClear,
}: Props) {
  return (
    <section className="filters">

      <div className="filters-header">
        <div>
          <span>FILTROS</span>
          <strong>
            Buscar pedidos
          </strong>
        </div>
      </div>


      <div className="filters-grid">

        <Input
          placeholder="Buscar cliente, teléfono o tracking..."
          value={search}
          onChange={onSearch}
        />


        {from !== undefined && (
          <Input
            type="date"
            value={from}
            onChange={onFrom ?? (() => {})}
          />
        )}


        {to !== undefined && (
          <Input
            type="date"
            value={to}
            onChange={onTo ?? (() => {})}
          />
        )}


        {status !== undefined && (
          <Select
            value={status}
            onChange={onStatus ?? (() => {})}
            options={[
              ["", "Todos los estados"],
              ["pending", "Pendiente"],
              ["accepted", "Aceptado"],
              ["preparing", "Preparando"],
              ["ready", "Listo"],
              ["completed", "Completado"],
              ["cancelled", "Cancelado"],
            ]}
          />
        )}


        {payment !== undefined && (
          <Select
            value={payment}
            onChange={onPayment ?? (() => {})}
            options={[
              ["", "Todos los pagos"],
              ["pending", "Pendiente"],
              ["paid", "Pagado"],
              ["refunded", "Reembolsado"],
            ]}
          />
        )}


        {orderType !== undefined && (
          <Select
            value={orderType}
            onChange={onOrderType ?? (() => {})}
            options={[
              ["", "Todos los tipos"],
              ["delivery", "Delivery"],
              ["pickup", "Pickup"],
              ["dine_in", "Mesa"],
            ]}
          />
        )}

      </div>


      <button
        className="clear-button"
        onClick={onClear}
      >
        Limpiar filtros
      </button>



      <style jsx>{`

        .filters {
          padding: 20px;
          margin-bottom: 24px;
          border-radius: 20px;
          border:1px solid rgba(255,255,255,.07);

          background:
          linear-gradient(
            180deg,
            rgba(255,255,255,.04),
            rgba(255,255,255,.015)
          );
        }


        .filters-header {
          margin-bottom:16px;
        }


        .filters-header span {
          display:block;
          color:#f97316;
          font-size:9px;
          font-weight:800;
          letter-spacing:1.5px;
        }


        .filters-header strong {
          display:block;
          margin-top:5px;
          color:#fff;
          font-size:15px;
          font-weight:800;
        }


        .filters-grid {

          display:grid;

          grid-template-columns:
          repeat(4,minmax(0,1fr));

          gap:12px;

        }



        input,
        select {

          width:100%;
          box-sizing:border-box;

          padding:13px 14px;

          border-radius:12px;

          border:
          1px solid rgba(255,255,255,.08);

          background:
          rgba(255,255,255,.04);

          color:#fff;

          outline:none;

          font-size:13px;

        }


        input::placeholder {
          color:#666;
        }


        select option {
          background:#111;
        }



        .clear-button {

          display:flex;
          align-items:center;
          justify-content:center;

          width:max-content;

          margin-left:auto;
          margin-top:16px;

          padding:11px 22px;

          border:none;

          border-radius:12px;

          background:#f97316;

          color:white;

          cursor:pointer;

          font-size:13px;

          font-weight:800;

          transition:
          transform .15s ease,
          opacity .15s ease;

        }


        .clear-button:hover {
          transform:translateY(-1px);
          opacity:.9;
        }



        @media(max-width:1100px){

          .filters-grid {

            grid-template-columns:
            repeat(2,minmax(0,1fr));

          }

        }



        @media(max-width:600px){

          .filters {

            padding:15px;
            border-radius:16px;

          }


          .filters-grid {

            grid-template-columns:1fr;

            gap:10px;

          }


          .clear-button {

            width:100%;
            margin-left:0;

          }

        }

      `}</style>

    </section>
  );
}



function Input({
  value,
  onChange,
  placeholder,
  type="text",
}:{
  value:string;
  onChange:(value:string)=>void;
  placeholder?:string;
  type?:string;
}){

  return(
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e)=>
        onChange(e.target.value)
      }
    />
  );
}



function Select({
  value,
  onChange,
  options,
}:{
  value:string;
  onChange:(value:string)=>void;
  options:string[][];
}){

  return(
    <select
      value={value}
      onChange={(e)=>
        onChange(e.target.value)
      }
    >

      {options.map(([value,label])=>(
        <option
          key={value}
          value={value}
        >
          {label}
        </option>
      ))}

    </select>
  );
}