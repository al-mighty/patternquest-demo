import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    // Send current leaderboard on connect
    client.emit('leaderboard:update', this.gameService.getLeaderboard());
  }

  handleDisconnect(_client: Socket) {}

  broadcastLeaderboard() {
    this.server.emit('leaderboard:update', this.gameService.getLeaderboard());
  }
}