import Paquetes from './components/Paquetes';
import Usuarios from './components/Usuarios';
import './App.css'


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>


      <div style={{ display: 'flex', flex: 1 }}>
        <Usuarios/>
        <Paquetes />
      </div>


    </div>
  );
}

export default App;