import { config } from "config/Constants";
import { Request, Response } from "express";
import shortId from 'shortid'
import { URLModel } from "database/model/URL";

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        // Ver se a URL já não existe
        const { originURL } = req.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            response.json(url)
            return
        }
        // Criar o hash pra essa URL       
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/hash`
        // Salvar a URL no banco
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        // Retornar a URL que a gente salvou
        response.json(newURL)
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        // Pegar hash da URL
        const { hash } = req.params
        // Encontrar a URL original pelo hash
        const url = await URLModel.findOne({ hash })

        if (url) {
            response.redirect(url.originURL)
            return
        }            
      
        response.status(400).json({ error: 'URL not found' })
    }
}