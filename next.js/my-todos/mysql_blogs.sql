-- 创建blogs数据库
CREATE DATABASE IF NOT EXISTS blogs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用blogs数据库
USE blogs;

-- 创建用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 创建博客文章表
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id INT NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    featured_image VARCHAR(255),
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建分类表
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建文章分类关联表
CREATE TABLE post_categories (
    post_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 创建标签表
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE,
    slug VARCHAR(30) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建文章标签关联表
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 创建评论表
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT,
    guest_name VARCHAR(50),
    guest_email VARCHAR(100),
    content TEXT NOT NULL,
    parent_id INT DEFAULT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- 插入示例用户数据
INSERT INTO users (username, email, password_hash, full_name, bio) VALUES
('admin', 'admin@example.com', '$2y$10$example_hash', '管理员', '网站管理员'),
('zhang_san', 'zhang@example.com', '$2y$10$example_hash', '张三', '前端开发工程师'),
('li_si', 'li@example.com', '$2y$10$example_hash', '李四', '后端开发工程师'),
('wang_wu', 'wang@example.com', '$2y$10$example_hash', '王五', 'UI设计师');

-- 插入示例分类数据
INSERT INTO categories (name, description, slug) VALUES
('技术', '技术相关文章', 'tech'),
('生活', '生活感悟', 'life'),
('教程', '学习教程', 'tutorial'),
('新闻', '行业新闻', 'news');

-- 插入示例标签数据
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('Python', 'python'),
('React', 'react'),
('MySQL', 'mysql'),
('前端', 'frontend'),
('后端', 'backend'),
('数据库', 'database');

-- 插入示例文章数据
INSERT INTO posts (title, content, excerpt, author_id, status, view_count) VALUES
('JavaScript基础教程', 'JavaScript是一种高级的、解释型的编程语言...', '学习JavaScript的基础知识，包括变量、函数、对象等概念。', 2, 'published', 150),
('Python入门指南', 'Python是一种易于学习又功能强大的编程语言...', '从零开始学习Python编程，掌握基本语法和常用库。', 3, 'published', 200),
('React组件开发', 'React是一个用于构建用户界面的JavaScript库...', '深入理解React组件开发，包括函数组件和类组件。', 2, 'published', 180),
('MySQL数据库优化', '数据库性能优化是提高应用性能的关键...', '学习MySQL数据库的优化技巧和最佳实践。', 3, 'published', 120),
('我的编程之路', '从大学开始接触编程，到现在已经五年了...', '分享我的编程学习经历和心得体会。', 4, 'published', 80);

-- 插入文章分类关联数据
INSERT INTO post_categories (post_id, category_id) VALUES
(1, 3), (1, 1),  -- JavaScript基础教程 -> 教程, 技术
(2, 3), (2, 1),  -- Python入门指南 -> 教程, 技术
(3, 3), (3, 1),  -- React组件开发 -> 教程, 技术
(4, 3), (4, 1),  -- MySQL数据库优化 -> 教程, 技术
(5, 2);          -- 我的编程之路 -> 生活

-- 插入文章标签关联数据
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (1, 5),  -- JavaScript基础教程 -> JavaScript, 前端
(2, 2), (2, 6),  -- Python入门指南 -> Python, 后端
(3, 3), (3, 5),  -- React组件开发 -> React, 前端
(4, 4), (4, 6), (4, 7),  -- MySQL数据库优化 -> MySQL, 后端, 数据库
(5, 5), (5, 6);  -- 我的编程之路 -> 前端, 后端

-- 插入示例评论数据
INSERT INTO comments (post_id, user_id, content, status) VALUES
(1, 3, '这篇文章写得很好，对我帮助很大！', 'approved'),
(1, 4, '请问有更详细的例子吗？', 'approved'),
(2, 2, 'Python确实是一门很友好的语言', 'approved'),
(3, 3, 'React的组件化思想很棒', 'approved'),
(4, 2, '数据库优化真的很重要', 'approved');

INSERT INTO comments (post_id, guest_name, guest_email, content, status) VALUES
(1, '访客', 'guest@example.com', '感谢分享！', 'approved'),
(2, '学习者', 'learner@example.com', '正在学习中，很有用', 'approved'),
(5, '程序员', 'coder@example.com', '感同身受，加油！', 'approved');