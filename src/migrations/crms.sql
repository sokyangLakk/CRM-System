-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2026 at 06:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crms`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `description`, `ip_address`, `created_at`) VALUES
(1, 1, 'login', 'Admin logged in.', '192.168.1.10', '2026-06-01 03:53:52'),
(2, 1, 'create_schedule', 'Created cleaning schedule for Class A on 2026-05-25.', '192.168.1.10', '2026-06-01 03:53:52'),
(3, 1, 'create_schedule', 'Created cleaning schedule for Class B on 2026-05-26.', '192.168.1.10', '2026-06-01 03:53:52'),
(4, 2, 'login', 'Teacher Mr. Chan logged in.', '192.168.1.21', '2026-06-01 03:53:52'),
(5, 2, 'mark_done', 'Marked assignment #1 (Dara / Water flowers) as done.', '192.168.1.21', '2026-06-01 03:53:52'),
(6, 2, 'mark_done', 'Marked assignment #2 (Kosal / Clean yard) as done.', '192.168.1.21', '2026-06-01 03:53:52'),
(7, 3, 'login', 'Teacher Ms. Sopha logged in.', '192.168.1.22', '2026-06-01 03:53:52'),
(8, 3, 'mark_missed', 'Marked assignment #6 (Phearith / Ground floor) as missed.', '192.168.1.22', '2026-06-01 03:53:52'),
(9, 3, 'create_punishment', 'Created punishment record for student Phearith (id=6).', '192.168.1.22', '2026-06-01 03:53:52'),
(10, 1, 'create_schedule', 'Created punishment cleaning schedule for 2026-06-02.', '192.168.1.10', '2026-06-01 03:53:52'),
(11, 4, 'login', 'Teacher Mr. Borey logged in.', '192.168.1.23', '2026-06-01 03:53:52'),
(12, 4, 'mark_done', 'Marked assignment #7 (Monita / Girl WC 1F) as done.', '192.168.1.23', '2026-06-01 03:53:52'),
(13, 1, 'deactivate_student', 'Set student Vannda (id=10) status to inactive.', '192.168.1.10', '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `advisor_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `class_name`, `advisor_id`, `created_at`, `updated_at`) VALUES
(1, 'A', 1, '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(2, 'B', 2, '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(3, 'C', 3, '2026-06-01 03:53:52', '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `cleaning_assignments`
--

CREATE TABLE `cleaning_assignments` (
  `id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `status` enum('pending','completed','missed') DEFAULT 'pending',
  `points_earned` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cleaning_assignments`
--

INSERT INTO `cleaning_assignments` (`id`, `schedule_id`, `student_id`, `task_id`, `status`, `points_earned`, `created_at`) VALUES
(1, 1, 1, 1, 'completed', 10, '2026-06-01 03:53:52'),
(2, 1, 2, 2, 'completed', 10, '2026-06-01 03:53:52'),
(3, 1, 3, 3, 'completed', 10, '2026-06-01 03:53:52'),
(4, 2, 4, 4, 'completed', 10, '2026-06-01 03:53:52'),
(5, 2, 5, 5, 'completed', 10, '2026-06-01 03:53:52'),
(6, 2, 6, 7, 'missed', 0, '2026-06-01 03:53:52'),
(7, 3, 7, 6, 'completed', 10, '2026-06-01 03:53:52'),
(8, 3, 8, 8, 'completed', 10, '2026-06-01 03:53:52'),
(9, 3, 9, 9, 'completed', 10, '2026-06-01 03:53:52'),
(10, 4, 1, 10, 'completed', 10, '2026-06-01 03:53:52'),
(11, 4, 2, 11, 'completed', 10, '2026-06-01 03:53:52'),
(12, 4, 3, 2, 'completed', 10, '2026-06-01 03:53:52'),
(13, 5, 4, 1, 'pending', 0, '2026-06-01 03:53:52'),
(14, 5, 5, 3, 'pending', 0, '2026-06-01 03:53:52'),
(15, 5, 6, 4, 'pending', 0, '2026-06-01 03:53:52'),
(16, 6, 7, 5, 'pending', 0, '2026-06-01 03:53:52'),
(17, 6, 8, 6, 'pending', 0, '2026-06-01 03:53:52'),
(18, 6, 9, 7, 'pending', 0, '2026-06-01 03:53:52'),
(19, 7, 6, 12, 'pending', 0, '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `cleaning_schedules`
--

CREATE TABLE `cleaning_schedules` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cleaning_schedules`
--

INSERT INTO `cleaning_schedules` (`id`, `date`, `class_id`, `teacher_id`, `description`, `status`, `created_at`) VALUES
(1, '2026-05-25', 1, 1, 'Regular Monday cleaning — Class A', 'completed', '2026-06-01 03:53:52'),
(2, '2026-05-26', 2, 2, 'Regular Tuesday cleaning — Class B', 'completed', '2026-06-01 03:53:52'),
(3, '2026-05-27', 3, 3, 'Wednesday deep-clean — Class C', 'completed', '2026-06-01 03:53:52'),
(4, '2026-05-28', 1, 1, 'Regular Thursday cleaning — Class A', 'completed', '2026-06-01 03:53:52'),
(5, '2026-05-29', 2, 2, 'Regular Friday cleaning — Class B', 'pending', '2026-06-01 03:53:52'),
(6, '2026-06-01', 3, 3, 'Regular Monday cleaning — Class C', 'pending', '2026-06-01 03:53:52'),
(7, '2026-06-02', 1, 1, 'Punishment schedule after incident 2026-05-29', 'pending', '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `cleaning_tasks`
--

CREATE TABLE `cleaning_tasks` (
  `id` int(11) NOT NULL,
  ``task_name`` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `points` int(11) DEFAULT 10,
  `max_students` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cleaning_tasks`
--

INSERT INTO `cleaning_tasks` (`id`, `task_name`, `description`, `points`, `max_students`, `created_at`) VALUES
(1, 'Water flowers (garden)', 'Water all plants in the front garden area.', 10, 1, '2026-06-01 03:53:52'),
(2, 'Clean yard', 'Sweep and collect rubbish from the school yard.', 10, 1, '2026-06-01 03:53:52'),
(3, 'Boy WC ground floor', 'Clean and mop the ground floor boys toilet.', 10, 1, '2026-06-01 03:53:52'),
(4, 'Girl WC ground floor', 'Clean and mop the ground floor girls toilet.', 10, 1, '2026-06-01 03:53:52'),
(5, 'Boy WC first floor', 'Clean and mop the first floor boys toilet.', 10, 1, '2026-06-01 03:53:52'),
(6, 'Girl WC first floor', 'Clean and mop the first floor girls toilet.', 10, 1, '2026-06-01 03:53:52'),
(7, 'Clean ground floor', 'Sweep and mop all ground floor corridors.', 10, 1, '2026-06-01 03:53:52'),
(8, 'B05 room cleaning', 'Sweep, mop, and tidy classroom B05.', 10, 1, '2026-06-01 03:53:52'),
(9, 'Water filter area cleaning', 'Wipe down water filter stations and surrounding area.', 10, 1, '2026-06-01 03:53:52'),
(10, 'B32 room cleaning', 'Sweep, mop, and tidy classroom B32.', 10, 1, '2026-06-01 03:53:52'),
(11, 'Storage room floor cleaning', 'Sweep and mop the storage room floor.', 10, 1, '2026-06-01 03:53:52'),
(12, 'Prepare washing plate area', 'Set up and clean the plate-washing area after lunch.', 5, 1, '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `punishment_records`
--

CREATE TABLE `punishment_records` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  ``offense`` text NOT NULL,`r`n  ``punishment_type`` varchar(100) NOT NULL,`r`n  ``created_by`` int(11) DEFAULT NULL,
  `points_deducted` int(11) DEFAULT 0,
  `status` enum('active','completed','cancelled') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `punishment_records`
--

INSERT INTO `punishment_records` (`id`, `student_id`, `offense`, `punishment_type`, `points_deducted`, `status`, `created_by`, `created_at`) VALUES
(1, 6, 'Failed to complete assigned cleaning duty on 2026-05-26 without valid reason.', 'extra_cleaning', 15, 'pending', 2, '2026-06-01 03:53:52'),
(2, 9, 'Repeated absence from cleaning schedule during May.', 'extra_cleaning', 15, 'completed', 1, '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  ``student_number`` varchar(50) NOT NULL,`r`n  ``class_id`` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `name`, `student_number`, `class_id`, `gender`, `email`, `phone`, `status`, `created_at`) VALUES
(1, 5, 'Dara Sok', 'STU-001', 1, 'male', 'dara@students.crms.local', '011-111-001', 'active', '2026-06-01 03:53:52'),
(2, 6, 'Kosal Phan', 'STU-002', 1, 'male', 'kosal@students.crms.local', '011-111-002', 'active', '2026-06-01 03:53:52'),
(3, 7, 'Sreymom Keo', 'STU-003', 1, 'female', 'sreymom@students.crms.local', '011-111-003', 'active', '2026-06-01 03:53:52'),
(4, 8, 'Virak Chhay', 'STU-004', 2, 'male', 'virak@students.crms.local', '011-111-004', 'active', '2026-06-01 03:53:52'),
(5, 9, 'Rachana Him', 'STU-005', 2, 'female', 'rachana@students.crms.local', '011-111-005', 'active', '2026-06-01 03:53:52'),
(6, 10, 'Phearith Noun', 'STU-006', 2, 'male', 'phearith@students.crms.local', '011-111-006', 'active', '2026-06-01 03:53:52'),
(7, 11, 'Monita Yim', 'STU-007', 3, 'female', 'monita@students.crms.local', '011-111-007', 'active', '2026-06-01 03:53:52'),
(8, 12, 'Sopheap Tith', 'STU-008', 3, 'male', 'sopheap@students.crms.local', '011-111-008', 'active', '2026-06-01 03:53:52'),
(9, 13, 'Kimheng Ros', 'STU-009', 3, 'female', 'kimheng@students.crms.local', '011-111-009', 'active', '2026-06-01 03:53:52'),
(10, 14, 'Vannda Meas', 'STU-010', 1, 'male', 'vannda@students.crms.local', '011-111-010', 'suspended', '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  ``department`` varchar(100) DEFAULT NULL,`r`n  ``email`` varchar(100) NOT NULL,`r`n  ``phone`` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `user_id`, `name`, `department`, `email`, `phone`, `created_at`) VALUES
(1, 2, 'Mr. Chan Dara', 'Mathematics', 'chan@crms.local', '012-345-678', '2026-06-01 03:53:52'),
(2, 3, 'Ms. Sopha Lim', 'Science', 'sopha@crms.local', '017-234-567', '2026-06-01 03:53:52'),
(3, 4, 'Mr. Borey Khem', 'Khmer', 'borey@crms.local', '010-987-654', '2026-06-01 03:53:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','teacher','student') NOT NULL,
  `status` enum('active','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin1', 'admin123', 'admin@crms.local', 'admin', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(2, 'tchan', 'teach123', 'chan@crms.local', 'teacher', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(3, 'tsopha', 'teach123', 'sopha@crms.local', 'teacher', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(4, 'tborey', 'teach123', 'borey@crms.local', 'teacher', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(5, 'sdara', 'student123', 'dara@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(6, 'skosal', 'student123', 'kosal@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(7, 'ssreymom', 'student123', 'sreymom@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(8, 'svirak', 'student123', 'virak@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(9, 'srachana', 'student123', 'rachana@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(10, 'sphearith', 'student123', 'phearith@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(11, 'smonita', 'student123', 'monita@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(12, 'ssopheap', 'student123', 'sopheap@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(13, 'skimheng', 'student123', 'kimheng@students.crms.local', 'student', 'active', '2026-06-01 03:53:52', '2026-06-01 03:53:52'),
(14, 'svannda', 'student123', 'vannda@students.crms.local', 'student', 'suspended', '2026-06-01 03:53:52', '2026-06-01 03:53:52');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `classes_ibfk_1` (`advisor_id`);

--
-- Indexes for table `cleaning_assignments`
--
ALTER TABLE `cleaning_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `cleaning_schedules`
--
ALTER TABLE `cleaning_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `cleaning_tasks`
--
ALTER TABLE `cleaning_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `punishment_records`
--
ALTER TABLE `punishment_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY ``created_by`` (``created_by``);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `student_number` (`student_number`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `students_ibfk_2` (`class_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cleaning_assignments`
--
ALTER TABLE `cleaning_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `cleaning_schedules`
--
ALTER TABLE `cleaning_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cleaning_tasks`
--
ALTER TABLE `cleaning_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `punishment_records`
--
ALTER TABLE `punishment_records`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`advisor_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cleaning_assignments`
--
ALTER TABLE `cleaning_assignments`
  ADD CONSTRAINT `cleaning_assignments_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `cleaning_schedules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cleaning_assignments_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cleaning_assignments_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `cleaning_tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cleaning_schedules`
--
ALTER TABLE `cleaning_schedules`
  ADD CONSTRAINT ``cleaning_schedules_ibfk_1`` FOREIGN KEY (``class_id``) REFERENCES ``classes`` (``id``) ON DELETE SET NULL,
  ADD CONSTRAINT ``cleaning_schedules_ibfk_2`` FOREIGN KEY (``teacher_id``) REFERENCES ``teachers`` (``id``) ON DELETE SET NULL;

--
-- Constraints for table `punishment_records`
--
ALTER TABLE `punishment_records`
  ADD CONSTRAINT ``punishment_records_ibfk_1`` FOREIGN KEY (``student_id``) REFERENCES ``students`` (``id``),`r`n  ADD CONSTRAINT ``punishment_records_ibfk_2`` FOREIGN KEY (``created_by``) REFERENCES ``teachers`` (``id``) ON DELETE SET NULL;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT ``students_ibfk_2`` FOREIGN KEY (``class_id``) REFERENCES ``classes`` (``id``) ON DELETE SET NULL;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

