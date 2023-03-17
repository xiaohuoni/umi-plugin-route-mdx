import React from "react";
import type { FC } from "react";
import { Markdown } from "umi";

const HomePage: FC = () => {
  return (
    <div>
      <p>{Math.random()}</p>
      <Markdown>
      ## a 
       </Markdown>
       <Markdown>
        ### a 
       </Markdown>
       <Markdown>
        # a 
       </Markdown>
       <Markdown>
        #### a 
       </Markdown>
    </div>
  );
};

export default HomePage;
