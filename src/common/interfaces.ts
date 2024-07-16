import * as express from "express";

export interface RequestWithUser extends express.Request {
  user: {
    id: string;
    email: string;
  };
}
