import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())



app.post('/usuarios', async (req, res) =>{

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(201).json(req.body)

})

app.put('/usuarios/:id', async (req, res) =>{

    try {
    const { name, age, email } = req.body;

    const updatedUser = await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
    })

    res.status(200).json({
        message: "Usuário atualizado com sucesso", 
        usuario: updatedUser,
    });

}   catch (error) {
    console.error(error);
    res.status(500).json({
        message:"Erro ao atualizar",
        error: error.message,
    })
}
})

app.delete('/usuarios/:id', async (req,res)=>{
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({message:"Usuario deletado com sucesso"})
})

app.get('/usuarios',async (req, res) => {

    const users = await prisma.user.findMany()

    res.status(200).json(users)

})

app.listen(3000)
