import Datepicker from "tailwind-datepicker-react";

const CheckoutCardDate: React.FC = () => {
    return (
      <div className="w-[361px] h-[99px] left-0 top-[39.94px] absolute">
        <div className="w-[361px] h-[99px] left-0 top-0 absolute bg-white rounded-2xl shadow" />
        <div className="w-[327.32px] h-[71px] left-[17.89px] top-[17px] absolute">
          <div className="w-[123.14px] left-[204.18px] top-[25px] absolute text-[#7862fc] text-sm font-bold font-['DM Sans'] leading-[19.07px]">Change Address</div>
          <div className="w-[185.24px] left-0 top-0 absolute">
            <span className="text-[#0a2533] text-base font-bold font-['DM Sans'] leading-snug">University of Queensland<br/></span>
            <span className="text-[#48515e] text-base font-normal font-['DM Sans'] leading-normal">Saint Lucia Campus</span>
          </div>
        </div>
      </div>
    )
  }
  
  export default CheckoutCardDate;