/*
 * Copyright (C) 2023 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useEffect, useCallback} from 'react'
import {Table} from '@instructure/ui-table'
import {Heading} from '@instructure/ui-heading'
import {StatusPill} from './status_pill'
import {SourceLink} from './source_link'
import doFetchApi from '@canvas/do-fetch-api-effect'
import {useScope as useI18nScope} from '@canvas/i18n'
import {showFlashError} from '@canvas/alerts/react/FlashAlert'
import {datetimeString} from '@canvas/datetime/date-functions'
import {ContentMigrationItem} from './types'
import {ActionButton} from './action_button'
import {buildProgressCellContent} from './completion_progress_bar'

const {
  Head: TableHead,
  Row: TableRow,
  ColHeader: TableColHeader,
  Body: TableBody,
  Cell: TableCell,
} = Table as any

const I18n = useI18nScope('content_migrations_redesign')

type MigrationsResponse = {json: ContentMigrationItem[]}
type MigrationResponse = {json: ContentMigrationItem}

export const ContentMigrationsTable = ({
  migrations,
  setMigrations,
}: {
  migrations: ContentMigrationItem[]
  setMigrations: (migrations: ContentMigrationItem[]) => void
}) => {
  useEffect(() => {
    doFetchApi({
      path: `/api/v1/courses/${window.ENV.COURSE_ID}/content_migrations`,
      params: {per_page: 25},
    })
      .then((response: MigrationsResponse) => setMigrations(response.json))
      .catch(showFlashError(I18n.t("Couldn't load previous content migrations")))
  }, [setMigrations])

  const refetchMigrationItem = useCallback(
    (migrationId: string) => () => {
      doFetchApi({
        path: `/api/v1/courses/${window.ENV.COURSE_ID}/content_migrations/${migrationId}`,
      })
        .then((response: MigrationResponse) =>
          // I needed to do this to force re-render
          setMigrations(migrations.map(m => (m.id === migrationId ? response.json : m)))
        )
        .catch(showFlashError(I18n.t("Couldn't update content migrations")))
    },
    [migrations, setMigrations]
  )

  return (
    <>
      <Heading level="h2" as="h2" margin="small 0">
        {I18n.t('Import Queue')}
      </Heading>
      <Table caption={I18n.t('Content Migrations')}>
        <TableHead>
          <TableRow>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="content_type">
              {I18n.t('Content Type')}
            </TableColHeader>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="source_link">
              {I18n.t('Source Link')}
            </TableColHeader>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="date_imported">
              {I18n.t('Date Imported')}
            </TableColHeader>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="status">
              {I18n.t('Status')}
            </TableColHeader>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="progress">
              {I18n.t('Progress')}
            </TableColHeader>
            <TableColHeader themeOverride={{padding: '0.6rem 0'}} id="action">
              {I18n.t('Action')}
            </TableColHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {migrations.map((cm: ContentMigrationItem) => (
            <TableRow key={cm.id}>
              <TableCell themeOverride={{padding: '1.1rem 0rem'}}>
                {cm.migration_type_title}
              </TableCell>
              <TableCell>
                <SourceLink item={cm} />
              </TableCell>
              <TableCell>
                {datetimeString(cm.created_at, {timezone: ENV.CONTEXT_TIMEZONE})}
              </TableCell>
              <TableCell>
                <StatusPill
                  hasIssues={cm.migration_issues_count !== 0}
                  workflowState={cm.workflow_state}
                />
              </TableCell>
              <TableCell>{buildProgressCellContent(cm, refetchMigrationItem(cm.id))}</TableCell>
              <TableCell>
                <ActionButton
                  migration_type_title={cm.migration_type_title}
                  migration_issues_count={cm.migration_issues_count}
                  migration_issues_url={cm.migration_issues_url}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default ContentMigrationsTable
