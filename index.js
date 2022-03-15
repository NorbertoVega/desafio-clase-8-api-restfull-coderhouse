const express = require('express')
const { Router } = express;
const PORT = 8080;

const app = express();
const router = Router();
const ProductApi = require('./productApi.js');
const productApi = new ProductApi();

const server = app.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${PORT}`);
});
server.on("error", error => console.log(`Error en servidor ${error}`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

router.get('/productos', (req, res) => {
    const allProducts = productApi.getAll();
    res.send(allProducts);
});

router.get('/productos/:id', (req, res) => {
    const id = req.params.id;
    const productById = productApi.getById(id);
    if (productById === null) {
        const error = 'Producto no encontrado.';
        res.send({ error });
        return;
    }
    res.send(productById);
});

router.post('/productos', (req, res) => {
    const product = req.body;
    const resultado = productApi.save(product);
    if (resultado !== null){
        res.send({ productSaved: resultado });
        return;
    }
    
    res.send(resultado);
});

router.put('/productos/:id', (req, res) => {
    const product = req.body;
    const id = req.params.id;
    const productoActualizado = productApi.updateByID(id, product);
    if (productoActualizado !== null) {
        res.send({ productoActualizado })
        return;
    }
    const error = 'Producto no encontrado. No se pudo actualizar.';
    res.send({ error });
});

router.delete('/productos/:id', (req, res) => {
    const id = req.params.id;
    const resultado = productApi.deleteById(id);
    if (resultado === -1) {
        const error = 'Producto no encontrado. No se pudo eliminar.';
        res.send({ error });
        return;
    }
    res.send({idProductoEliminido: resultado})
});

app.use('/api', router);