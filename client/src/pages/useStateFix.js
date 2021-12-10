const [value, setValue] = useState("");
setValue("React is awesome!");
setValue((state) => {
  console.log(state); // "React is awesome!"
  // here you will get the instant value 
  return state;
});