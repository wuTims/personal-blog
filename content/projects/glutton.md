---
title: Glutton
summary: A simple RAG backend for document ingestion and semantic search, built with hexagonal architecture and spec-kit
date: 2025-09-28
tags:
  - python
  - rag
  - ai
github: https://github.com/wuTims/glutton
cover: https://media.wutims.com/glutton_project_icon.png
featured: true
published: true
---

# What is Glutton

Glutton is a RAG (Retrieval-Augmented Generation) backend system for document ingestion and semantic search. It processes documents (PDFs, DOCX, text files), converts them into semantic embeddings, stores them in a vector database, and allows you to query them using natural language.

# Why I Built It

I wanted to understand how context retrieval could be made more efficient. After researching RAG, I decided to build a simple pipeline to get a better understanding of how things work under the hood. This project also gave me a chance to experiment with Spec Driven Design using GitHub's spec-kit.

# The Architecture

While searching for a solution that would allow for loose scaffolding and easily swappable pieces, I came across hexagonal architecture (ports and adapters pattern). It created the perfect mental model for me to understand how to design a system around core business logic.

The codebase is structured into three layers:

- **Domain Layer**: Pure business logic, text chunking, configuration management
- **Application Layer**: Services that orchestrate the workflow (IngestService, QueryService)
- **Adapters**: Swappable implementations for document loading (Docling), vector storage (Weaviate), and audit logging

This means I can swap out Weaviate for Pinecone, or replace the embedding model, without touching any of the core application logic.

# Tech Stack

- **Python 3.11+** with strict typing (mypy)
- **Docling** for document processing
- **Sentence Transformers** (BGE-small-en-v1.5) for embeddings
- **Weaviate** as the vector database
- **Pydantic** for configuration management
- **pytest** with embedded Weaviate for testing

# What I Learned

Building this gave me a clearer picture of how document chunking strategies, embedding dimensions, and vector similarity search all fit together. There's still a lot of depth I haven't explored, like fine-tuning embedding models or multi-modal RAG pipelines, but the goal was to understand the basics and that's what I got out of it.
