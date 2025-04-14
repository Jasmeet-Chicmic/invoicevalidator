import FileUploader from "../../Components/Cells/FileUploader"


const Home = () => {
  return (
    <div>
        <div>
           <FileUploader onUpload={(file)=>{
            console.log("on upload",file);
            
           }}></FileUploader>
        </div>
        <div> submit</div>
    </div>
  )
}

export default Home