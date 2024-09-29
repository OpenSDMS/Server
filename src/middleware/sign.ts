
import { Request, Response } from "express";

export default function sign (request: Request, response: Response, next: any) {
    console.log("security");
    next();
}