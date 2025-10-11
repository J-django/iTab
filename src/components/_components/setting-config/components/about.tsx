import List from "@/components/list";

const About = () => {
  return (
    <List>
      {/*版本号*/}
      <List.Item title="版本号" content={import.meta.env.VITE_APP_VERSION} />
    </List>
  );
};

export default About;
