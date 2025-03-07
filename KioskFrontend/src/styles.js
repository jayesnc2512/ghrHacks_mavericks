// src/styles.js
export const styles = {
  app: {
    textAlign: 'center',
    maxHeight: "100vh",
    // overflowY: "hidden",
    overflowX:"hidden"
    // fontFamily: 'Arial, sans-serif',
  },
  header: {
    padding: '20px',
    color: 'black',
    // display: "flex",
    flexDirection:"horizontal"
  },
  brandname: {
    position: "absolute",
    top: "2px",
    right: "10px",
    color:"Gray"
    
  },
  logo: {
    position:"absolute",
    margin: "5px 5px 0",
    paddingTop:"0px",
    height: "100px",
    left: "0",
    top:"5px"
  },
  headingBox: {
    textAlign: "start",
    marginTop:"10px",
    margin:"auto"
  },
  h6: {
    color:"red"
  },

  list: {
    margin:"auto 0"
  },
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '20px',
  },
  cameraView: {
    position: 'relative',
    // marginTop:"10px",
    width: '400px',
    height: '70vh',
    display: "flex",
    flexDirection: "column",
    objectFit: 'cover',
    backgroundColor: 'black', 
  },
  detectionView: {
    // marginTop: "10px",

    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
 
  listItemSuccess: {
    fontWeight: '500',
    width: "80px",
    margin: '10px 0px',
    padding: "3px 0",
    borderRadius: '10px',
    justifyContent: 'center', // Corrected to 'center' for alignment
    border: '1px solid black',
    backgroundColor: 'green',
    color: 'white',
  },
  listItemFail: {
    fontWeight: '500',
    width: "80px",
    margin: '10px 0px',
    padding: "3px 0",
    borderRadius: '10px',
    justifyContent: 'center', // Corrected to 'center' for alignment
    border: '1px solid black',
    backgroundColor: 'red',
    color: 'white',
  },
  listItemGray: {
    fontWeight: '500',
    width: "80px",
    margin: '10px 0px',
    padding: "3px 0",
    borderRadius: '10px',
    justifyContent: 'center', // Corrected to 'center' for alignment
    border: '1px solid black',
    backgroundColor: 'gray',
    color: 'white',
    cursor: 'not-allowed', // to indicate it's disabled
  },
  checkmark: {
    color: 'green',
    fontSize: '20px',
    marginLeft: '10px',
  },
  crossmark: {
    color: 'red',
    fontSize: '20px',
    marginLeft: '10px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  imagesContainer: {
    marginTop: '-5vh',
    display: 'flex',
    height:"75vh",
    justifyContent: 'space-between',
    marginLeft:"10px"
    
  },
  ppeImage: {
    width: '300px',
    height: 'auto',
    marginLeft: '10px',
  },
  capturedFramesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  capturedFrame: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    border: '2px solid #ccc',
    borderRadius: '8px',
  },
  bor: {
    borderRight: "dashed 3px  black",
    width: "-10px",
    height:"70vh"
  },
  buttonGroup:{
    justifyContent:"center"
  }
};
