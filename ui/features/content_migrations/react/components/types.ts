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
import {Dispatch, SetStateAction} from 'react'

export type ContentMigrationItemSettings = {
  source_course_id: string
  source_course_name: string
  source_course_html_url: string
}

export type Migrator = {
  type: string
  requires_file_upload: true
  name: string
  required_settings: string
}

export type ContentMigrationItemAttachment = {
  display_name: string
  url: string
}

export type ContentMigrationWorkflowState =
  | 'pre_processing'
  | 'failed'
  | 'waiting_for_select'
  | 'running'
  | 'completed'

export type ContentMigrationItem = {
  id: string
  migration_type:
    | 'course_copy_importer'
    | 'canvas_cartridge_importer'
    | 'zip_file_importer'
    | 'common_cartridge_importer'
    | 'moodle_converter'
    | 'qti_converter'
  migration_type_title: string
  progress_url: string
  settings: ContentMigrationItemSettings
  attachment?: ContentMigrationItemAttachment
  workflow_state: ContentMigrationWorkflowState
  migration_issues_count: number
  migration_issues_url: string
  created_at: string
}

export type submitMigrationProps = {
  selectiveImport: boolean
  importAsNewQuizzes: boolean
  adjustDates: boolean
}

export type submitMigrationCallbackType = ({
  selectiveImport,
  importAsNewQuizzes,
  adjustDates,
}: submitMigrationProps) => void

export type setSourceCourseType = Dispatch<SetStateAction<string>>
