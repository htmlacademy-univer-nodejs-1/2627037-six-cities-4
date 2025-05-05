#!/usr/bin/env node

import { CLIApplication } from './cli/cli-application.js';
import { HelpCommand } from './cli/help.command.js';
import { ImportCommand } from './cli/import.command.js';
import { VersionCommand } from './cli/version.command.js';

function bootstrap() {
  const app = new CLIApplication();
  app.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand()
  ]);
  app.processCommandLineArgs(process.argv);
}

bootstrap();
