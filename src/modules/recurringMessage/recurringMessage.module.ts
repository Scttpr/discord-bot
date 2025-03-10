import { SlashCommandBuilder } from 'discord.js';

import { createModule } from '../../core/createModule';
import {
  addRecurringMessage,
  hasPermission,
  listRecurringMessages,
  relaunchRecurringMessages,
  removeAllFromChannel,
  removeRecurringMessage,
} from './recurringMessage.helpers';

export const recurringMessage = createModule({
  slashCommands: () => [
    {
      schema: new SlashCommandBuilder()
        .setName('recurrent')
        .setDescription('Manage recurring messages')
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Add a recurring message')
            .addStringOption((option) =>
              option
                .setName('frequency')
                .setDescription('How often to send the message')
                .addChoices(
                  { name: 'daily', value: 'daily' },
                  { name: 'weekly', value: 'weekly' },
                  { name: 'monthly', value: 'monthly' },
                )
                .setRequired(true),
            )
            .addStringOption((option) =>
              option.setName('message').setDescription('The message to send').setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Remove a recurring message')
            .addStringOption((option) =>
              option
                .setName('id')
                .setDescription('The id of the recurring message to remove')
                .setRequired(true),
            ),
        )
        .addSubcommand((subcommand) =>
          subcommand.setName('list').setDescription('List recurring messages'),
        )
        .toJSON(),
      handler: {
        add: async (interaction) => {
          if (!hasPermission(interaction)) return;

          await addRecurringMessage(interaction);
        },
        remove: async (interaction) => {
          if (!hasPermission(interaction)) return;

          await removeRecurringMessage(interaction);
        },
        list: async (interaction) => {
          if (!hasPermission(interaction)) return;

          await listRecurringMessages(interaction);
        },
      },
    },
  ],
  eventHandlers: () => ({
    ready: relaunchRecurringMessages,
    channelDelete: removeAllFromChannel,
  }),
  intents: ['Guilds'],
});
