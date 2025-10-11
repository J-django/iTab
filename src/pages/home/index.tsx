import { Clock } from "@/components/_components/clock";
import { Search } from "@/components/_components/search";

const Home = () => {
  return (
    <div className="pl-25 pr-12.5 py-10 w-full">
      {/*时间*/}
      <Clock />

      {/*查询*/}
      <Search />
    </div>
  );
};

export default Home;
