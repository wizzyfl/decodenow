import React from "react";
import { CoaUploader } from "components/CoaUploader";
import { MainLayout } from "components/MainLayout";

const App = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <CoaUploader />
      </div>
    </MainLayout>
  );
};

export default App;



