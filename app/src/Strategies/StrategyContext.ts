import { IStrategy } from "./IStrategy";

export class StrategyContext {
    private strategy!: IStrategy;
    
    setStrategy(strategy: IStrategy) {
        this.strategy = strategy;
    }
    execute() {
        this.strategy.addMessageListener();
    }
}