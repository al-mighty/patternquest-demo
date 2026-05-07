import { Controller, Post, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GameService } from './game.service';
import { StartGameDto, SubmitAnswerDto } from '@logiclike/shared';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  start(@Body() body: unknown) {
    const parsed = StartGameDto.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.message, HttpStatus.BAD_REQUEST);
    return this.gameService.startGame(parsed.data.nickname);
  }

  @Post('answer')
  answer(@Body() body: unknown) {
    const parsed = SubmitAnswerDto.safeParse(body);
    if (!parsed.success) throw new HttpException(parsed.error.message, HttpStatus.BAD_REQUEST);
    const result = this.gameService.submitAnswer(parsed.data.sessionId, parsed.data.answerIndex);
    if (!result) throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Get('stats/:sessionId')
  stats(@Param('sessionId') sessionId: string) {
    const stats = this.gameService.getStats(sessionId);
    if (!stats) throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    return stats;
  }

  @Get('scores')
  scores() {
    return this.gameService.getLeaderboard();
  }
}